<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template name="blank-view">
	<h2>Welcome to Manual.</h2>

	<div class="block-buttons">
		<div class="btn" data-click="open-filesystem">
			<i class="icon-folder-open"></i>
			Open&#8230;
		</div>

		<div class="btn disabled_" data-click="from-clipboard">
			<i class="icon-clipboard"></i>
			From clipboard
		</div>
	</div>

	<div class="block-samples" data-click="select-sample">
		<h3>Example</h3>
		<xsl:call-template name="sample-list" />
	</div>

</xsl:template>


<xsl:template name="sample-list">
	<xsl:for-each select="./Samples/*">
		<div class="sample">
			<!-- <xsl:attribute name="style">background-image: url(<xsl:value-of select="@path"/>);</xsl:attribute> -->
			<xsl:attribute name="data-url"><xsl:value-of select="@path"/></xsl:attribute>
			<span class="name"><xsl:value-of select="@name"/></span>
		</div>
	</xsl:for-each>
</xsl:template>


<xsl:template name="sideBar">
	<ul>
		<xsl:for-each select="./*">
		<li>
			<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
			<legend>
				<xsl:choose>
					<xsl:when test="count(./*) > 0">
						<span class="arrow"><svg><use href="#icon-arrow-right"/></svg></span>
					</xsl:when>
					<xsl:otherwise>
						<span class="blank"></span>
					</xsl:otherwise>
				</xsl:choose>
				<xsl:value-of select="@name"/>
			</legend>
			<xsl:if test="count(./*) > 0">
				<div>
					<ul>
						<xsl:for-each select="./*">
							<li>
								<xsl:attribute name="data-path"><xsl:value-of select="@path"/></xsl:attribute>
								<xsl:value-of select="@name"/>
							</li>
						</xsl:for-each>
					</ul>
				</div>
			</xsl:if>
		</li>
		</xsl:for-each>
	</ul>
</xsl:template>

</xsl:stylesheet>
